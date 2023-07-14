export {};

declare global {
  namespace ig {
    namespace SaveSlot {
      interface Data {
        stats: Data.Stats;
      }

      namespace Data {
        interface Stats {
          combat: Record<string, number>;
        }
      }
    }
  }
}
