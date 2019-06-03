import Storage from "@/classes/Storage";
import axios from "axios"
import TMDb from "@/classes/TMDb";

class Recommended {

    static async sync(type: string) {

        let liked: Array<any> = Storage.get('liked-list', {})[type] || [];
        let movies: Array<any> = []
        for (let i: number = 0; i < liked.length; i++) {
            let like: any = liked[i];
            let similars: Array<any> = [];
            await TMDb.get(`movie/${like.id}/recommendations`, [{name: 'sort_by', value: 'popularity.desc'}])
                .then((res: any) => {
                    similars = res.data.results;
                })

            movies = movies.concat(similars)
        }

        movies = movies.sort((a: any, b: any) => {
            let bDate: number = new Date(b.release_date).getTime();
            let aDate: number = new Date(a.release_date).getTime();
            return (b.vote_average * bDate) - (a.vote_average * aDate)
        })
        movies = Array.from(new Set(movies.map((m: any) => m.id)))
            .map((id: number) => movies.find((m: any) => m.id == id))

        Storage.put('recommended', movies)
    }
}

export default Recommended
