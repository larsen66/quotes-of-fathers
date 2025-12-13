import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("quotes_of_fathers.db");
