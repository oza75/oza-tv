import Storage from "@/classes/Storage";

export const addScript = (link: string) => {
    let script: HTMLScriptElement = document.createElement('script')
    script.src = link
    let head: HTMLElement = document.getElementsByTagName('head')[0]
    head.appendChild(script)
}

export const mapGenre = (genre: number) => {
    let genres: Array<any> = Storage.get('genres', [])
    return genres.find((g: any) => g.id == genre) || {}
}

export const lang = () => {
    return 'fr';
}
