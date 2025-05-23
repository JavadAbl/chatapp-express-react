export class AppHelper {
  public static generateUniqueString() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  }
}
