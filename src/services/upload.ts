export async function uploadImage(file: File) {

    const formData = new FormData();

    formData.append("file", file);

    const apiUrl = `${import.meta.env.API_URL}`.replace(/\/$/, "");
    const response = await fetch(`${apiUrl}/media`, {
        method: "POST",
        headers: {
            "X-API-KEY": import.meta.env.API_KEY
        },
        body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || data?.status !== 200) {

        throw new Error(
            data?.results ?? `Error al subir la imagen (${response.status})`
        );

    }

    return data;

}