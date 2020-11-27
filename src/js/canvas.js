import $ from 'jquery'

export class Canvas
{
    constructor()
    {
        this.$self = $('#canvas')
        this.self = this.$self[0]
        this.ctx = this.self.getContext('2d')
    }

    /**
     * Download
     */
    download()
    {
        let image = this.self.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        window.location.href = image
    }

    /**
     * <canvas />의 가이드(허팀장) 사진을 올림
     */
    drawGuide()
    {
        let guide = new Image()

        guide.width = 720
        guide.height = 1460
        guide.src = './assets/guide.png'
        guide.onload = () => this.ctx.drawImage(guide, 0, 0)
    }

    /**
     * 날씨 인포그래픽 
     * @param Object data 
     */
    drawWeather(data)
    {
        let ll = {}
        
    }
}