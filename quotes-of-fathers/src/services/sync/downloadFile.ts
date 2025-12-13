import * as FileSystem from "expo-file-system";

export async function downloadFile(
  url: string,
  localName: string
): Promise<string> {
  const localPath = FileSystem.documentDirectory + localName;

  const result = await FileSystem.downloadAsync(url, localPath);
  return result.uri;
}
