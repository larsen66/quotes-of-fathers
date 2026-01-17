import { downloadAsync, documentDirectory } from "expo-file-system/legacy";

export async function downloadFile(
  url: string,
  localName: string
): Promise<string> {
  if (!documentDirectory) {
    throw new Error("Document directory is not available");
  }
  
  const localPath = documentDirectory + localName;

  const result = await downloadAsync(url, localPath);
  return result.uri;
}
