class ServerData {
    static async client() {
      if (!this.server) {
        const { runDB } = await import("./config.js");
        const server = await runDB();
        // console.log(server)
        this.server = server;
      }
      return this.server;
    }
  
    static async closeClient() {
      if (this.server) {
        const client = this.server;
          client.close();
        // }
      }
    }
  
    static async openClient() {
      if (this.server) {
            this.server.connect();
        return this.server
      }
    }
  }
  
  module.exports = ServerData;