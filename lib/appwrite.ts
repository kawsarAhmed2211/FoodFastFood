import {Account, ID, Avatars, TablesDB, Client, Query, Storage} from "react-native-appwrite";
import {CartCustomization, CreateUserParams, GetMenuParams, SignInParams} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.jsm.foodorderingapp",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: "692478c2002c572b3939",
    bucketID: "692b14600005c4e1fdc4",
    tableId: "table",
    categoriesID: "categoriestable",
    menuID: "menu",
    customisationsID: "customisations",
    menucustomisationID: "menu_customisations"
};

export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const tables = new TablesDB(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

/* ---------------- SIGN IN ---------------- */

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        await account.createEmailPasswordSession({ email, password });
    } catch (error) {
        throw new Error(String(error));
    }
};

/* ---------------- CREATE USER ---------------- */

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create({
            userId: ID.unique(),
            email,
            password,
            name
        });

        if (!newAccount) throw new Error("Account creation failed");

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        const newUserProfile = await tables.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.tableId,
            rowId: ID.unique(),
            data: {
                email,
                name,
                accountId: newAccount.$id,
                avatar: avatarUrl,
            },
        });

        return newUserProfile;  // <-- REQUIRED FIX

    } catch (e) {
        throw new Error(String(e));
    }
};


export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await tables.listRows({
                databaseId: appwriteConfig.databaseId,
                tableId: appwriteConfig.tableId,
                queries: [Query.equal('accountId', currentAccount.$id)]
        })

        if(!currentUser) throw Error;

        return currentUser.rows[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getCategoriesTable = async () => {
    try {
        const menus = await tables.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.categoriesID,

        })


        console.log("Categories table: ", appwriteConfig.categoriesID);
        console.log("Customisations table: ", appwriteConfig.customisationsID);
        console.log("Menu", appwriteConfig.menuID);
        console.log("Menucustomisations table: ", appwriteConfig.menucustomisationID);
        return menus.rows;
    } catch (e) {
        throw new Error(e as string);
    }
}




export const getCustomisation = async() =>{
    try{
        const list = await tables.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.customisationsID,
        })
        return list.rows[0];
    }catch(error){
        throw new Error(String(error));
    }
}