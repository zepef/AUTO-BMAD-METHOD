/**
 * Prisma Client Type Stubs
 *
 * These are temporary type definitions used when @prisma/client hasn't been generated yet.
 * In production, these will be replaced by the actual generated types from Prisma.
 *
 * To generate proper Prisma types, run: pnpm db:generate
 */

declare module "@prisma/client" {
  export class PrismaClient {
    constructor(options?: any);
    $disconnect(): Promise<void>;
    $transaction<T>(fn: (prisma: any) => Promise<T>): Promise<T>;

    user: {
      findFirst(args?: any): Promise<any>;
      findUnique(args: any): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
      count(args?: any): Promise<number>;
    };

    project: {
      findUnique(args: any): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
    };

    artifact: {
      findUnique(args: any): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      update(args: any): Promise<any>;
      delete(args: any): Promise<any>;
      groupBy(args: any): Promise<any[]>;
      count(args?: any): Promise<number>;
    };

    message: {
      findMany(args?: any): Promise<any[]>;
      create(args: any): Promise<any>;
      delete(args: any): Promise<any>;
    };

    agentConfig: {
      findUnique(args: any): Promise<any>;
      findMany(args?: any): Promise<any[]>;
      upsert(args: any): Promise<any>;
    };
  }
}
