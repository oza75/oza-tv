const key = '6Cn0YwHTmKELJwkr'
const secret = "yu1pci8yx5ey9mh7ilnbd80548fsgc"
import axios from 'axios'

class Video {

    static async ticket(id: any) {
        let ip: any = null
        await axios.get('https://ipapi.co/json/').then((res: any) => {
            ip = res.data.ip
        })
        let url: string = `https://videospider.in/getticket.php?key=${key}&tmdb=1&secret_key=${secret}&video_id=${id}&s=0&ip=${ip}`;
        console.log(ip)
        return axios.get(`//cors-anywhere.herokuapp.com/${url}`)
    }
}

export default Video
