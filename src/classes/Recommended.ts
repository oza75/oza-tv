import Storage from "@/classes/Storage";
import axios from "axios"
import TMDb from "@/classes/TMDb";

class Recommended {

    static async sync(type: string, base: string = 'movie') {
        let liked: Array<any> = Storage.get('liked-list', {})[type] || [];
        let genres: Array<any> = Storage.get('genres', [])
        let likedGenres: any = {}

        genres.forEach((g: any) => {
            likedGenres[g.id] = 0;
        });

        let data: any = Storage.get('recommended', {})
        data[type] = [];
        let movies: Array<any> = data[type]

        for (let i: number = 0; i < liked.length; i++) {
            let like: any = liked[i];
            like.genre_ids.forEach((g: any) => likedGenres[g] = likedGenres[g] + 1)

            let similars: Array<any> = [];
            await TMDb.get(`${base}/${like.id}/recommendations`, [{name: 'sort_by', value: 'popularity.desc'}])
                .then((res: any) => {
                    similars = res.data.results;
                })

            movies = movies.concat(similars)
        }
        const reducer = (a: any, c: any) => {
            return a + likedGenres[c]
        }
        movies = movies.sort((a: any, b: any) => {
            let bDate: number = new Date(b.release_date).getTime();
            let aDate: number = new Date(a.release_date).getTime();
            let bGenreCount: number = b.genre_ids.reduce(reducer, 0)
            let aGenreCount: number = a.genre_ids.reduce(reducer, 0)
            bGenreCount = bGenreCount > 0 ? bGenreCount : 1
            aGenreCount = aGenreCount > 0 ? aGenreCount : 1
            return (b.vote_average  * bGenreCount) - (a.vote_average  * aGenreCount)
        })
        movies = Array.from(new Set(movies.map((m: any) => m.id)))
            .map((id: number) => movies.find((m: any) => m.id == id))
        let likedIds: Array<string> = liked.map((m: any) => m.id)
        movies = movies.filter((m: any) => !likedIds.includes(m.id))
        data[type] = movies

        Storage.put('recommended', data)
    }
}

export default Recommended
