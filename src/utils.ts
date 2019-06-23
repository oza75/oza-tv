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

export const title = {
    get: () => {
        return document.getElementsByTagName('title')[0].text
    },
    set: (value: string) => {
        document.getElementsByTagName('title')[0].text = value
        meta.add("og:title", value)
    }
}
export const description = {
    get: () => {
        // @ts-ignore
        return document.querySelector('meta[name="description"]').getAttribute('content')
    },
    set: (value: string) => {
        // @ts-ignore
        document.querySelector('meta[name="description"]').setAttribute("content", value)
        meta.add("og:description", value)
    }
}

export const meta = {
    get: (name: string) => {
        // @ts-ignore
        return document.querySelector(`meta[name="${name}"]`).getAttribute('content')
    },
    set: (name: string, value: string) => {
        // @ts-ignore
        document.querySelector(`meta[name="${name}"]`).setAttribute("content", value)
    },
    add: (name: string, value: string) => {
        let m: HTMLElement | null = document.querySelector(`meta[name="${name}"]`)
        if (m) {
            m.setAttribute("content", value);
        } else {
            let elem: HTMLMetaElement = document.createElement('meta')
            elem.setAttribute("name", name)
            elem.setAttribute("content", value)

            document.getElementsByTagName('head')[0].appendChild(elem)
        }
    }
}

export const now = () => {
    let d: Date = new Date();
    let str = d.getFullYear() + '-' + digit(d.getMonth()) + '-' + digit(d.getDay())
    return str;
}

export const digit = (n: any) => {
    return ("0" + n).slice(-2)
}
