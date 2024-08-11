import { client } from "@/honoClient"

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class API {
  public static uploadImage = async (_file: File) => {
    const res = await client.private.files.image.$post({
      form: {
        image: _file
      }
    })
    if (res.status !== 200) {
      throw await res.json()
    }
    const data = await res.json();
    return data.url
  }
}

export default API
