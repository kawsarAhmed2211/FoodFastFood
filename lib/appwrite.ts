import {Account, Avatars, Client, Databases, ID, Query, Storage, TablesDB} from "react-native-appwrite";
import {Category, CreateUserParams, GetMenuParams, SignInParams} from "@/type";


export const appwriteConfig ={
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.jsm.foodordering",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: "6942dfa5000bbf13bcf6",
    bucketId: "694961a3001d379e0d0d",
    userTable: "user",
    categoriesTable: "categories",
    menuTable: "menu",
    customisationsTable: "customisations",
    menu_customisationsTable: "menu_customisations"
}


export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);


export const account = new Account(client);
export const tables = new TablesDB(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        await account.createEmailPasswordSession({ email, password });
    } catch (error) {
        throw new Error(String(error));
    }
};

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
            tableId: appwriteConfig.userTable,
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
            tableId: appwriteConfig.userTable,
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
            tableId: appwriteConfig.categoriesTable,


        })


        console.log("Categories table: ", appwriteConfig.categoriesTable);
        console.log("Customisations table: ", appwriteConfig.customisationsTable);
        console.log("Menu", appwriteConfig.menuTable);
        console.log("Menucustomisations table: ", appwriteConfig.menu_customisationsTable);
        return menus.rows;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCustomisation = async() =>{
    try{
        const list = await tables.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.customisationsTable,
        })
        return list.rows[0];
    }catch(error){
        throw new Error(String(error));
    }
}


export const getMenu = async({category, query}: GetMenuParams) =>{
    try{
        const queries = [];
        if (category){
            queries.push(Query.equal('categories', category));
        }
        if(query){
            queries.push(Query.search("name",query));
        }

        const menus = await tables.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.menuTable,
            queries: queries
        })

        return menus.rows;
    }catch(error){
        throw new Error(String(error));
    }
}

export const getCategories = async() =>{
    try{
        const categories = await tables.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.categoriesTable
        })

        return categories.rows;
    }catch(error){
        throw new Error(String(error));
    }
}

