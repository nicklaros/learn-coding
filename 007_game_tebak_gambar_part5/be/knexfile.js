export default {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./db.sqlite",
    },
    useNullAsDefault: true,
  },
};
