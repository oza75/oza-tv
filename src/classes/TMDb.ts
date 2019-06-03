import Storage from "@/classes/Storage";

const key = "a9639fb280333597f0186a9e20e7df58";
const base = "https://api.themoviedb.org/3/";
import axios from "axios"
import {lang} from "@/utils";

export const url = "https://image.tmdb.org/t/p/";


export interface Query {
    name: string;
    value: any;
}

class TMDb {

    protected parseUrl(url: string, query?: Array<Query>) {
        query = query || [];
        query.push({name: "api_key", value: key})
        query.push({name: "language", value: lang()})

        let queries: string = query.map((q: Query) => q.name + "=" + encodeURI(q.value)).join("&")
        return base + url + "?" + queries;
    }

    static async trending(media_type: string = "all", time_window: string = "week") {
        let instance: TMDb = new TMDb();
        return axios.get(instance.parseUrl(`trending/${media_type}/${time_window}`))
    }

    static saveGenres(lang: string = 'fr_FR') {
        let instance: TMDb = new TMDb();
        let url: string = instance.parseUrl(`genre/movie/list`, [{name: "language", value: lang}]);
        axios.get(url).then((res: any) => {
            Storage.put('genres', res.data.genres)
        })
    }

    static get(url: string, query?: Array<Query>) {
        let instance: TMDb = new TMDb();
        return axios.get(instance.parseUrl(url, query));
    }
}

export default TMDb;
