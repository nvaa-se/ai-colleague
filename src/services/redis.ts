import { createClient, RedisClientType } from "redis";
import config from "../config/redis";

class RedisSingleton {
  private static instance: RedisClientType;

  private constructor() {} // private constructor to prevent instantiation

  public static async getClient(): Promise<RedisClientType> {
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = createClient({
        url: config.url
      });

      RedisSingleton.instance.on("error", (err) =>
        console.error("Redis Client Error", err)
      );

      await RedisSingleton.instance.connect();
      console.log("Redis client connected");
    }

    return RedisSingleton.instance;
  }

  public static async disconnect(): Promise<void> {
    if (RedisSingleton.instance) {
      await RedisSingleton.instance.disconnect();
      console.log("Redis client disconnected");
      RedisSingleton.instance = undefined;
    }
  }
}

export default RedisSingleton;
