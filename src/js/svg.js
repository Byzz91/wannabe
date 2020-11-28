import $ from 'jquery'
import * as d3 from 'd3'
import { saveSvgAsPng } from 'save-svg-as-png'
import moment from 'moment'
import { WeatherWidget } from './weatherWidget'
import { group } from 'd3'

export class SVG
{
    /**
     * Constructor
     */
    constructor()
    {
        this.svg = d3.select('#svg')
        this.svg.attr('version', 1.1)
                .attr('xmlns', 'http://www.w3.org/2000/svg')
    }

    /**
     * 배경화면에 가이드 배경을 올린다
     */
    drawGuide()
    {
        this.svg.attr('width', 720).attr('height', 1460)
        this.svg.append('svg:image')
            .attr('xlink:href', './assets/guide.png')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 720)
            .attr('height', 1460)
    }

    /**
     * 날짜 인포그래픽을 그린다
     * @param Object rd 
     */
    drawWeather(render)
    {
        /**
         * 인포그래픽을 그린다
         * @param {*} group_id 
         * @param {*} city 
         * @param {*} pos
         * @param {*} data 
         */
        let infoGraphic = (groupId, icon, pos) => {
            this.svg.append('svg:image').attr('xlink:href', `${icon}`)
                .attr('class', groupId)
                .attr('width', 77).attr('height', 76)
                .attr('x', pos.x).attr('y', pos.y)
        }

        /**
         * 타이포 그래픽
         * @param {} groupId 
         * @param {*} text 
         * @param {*} pos 
         */
        let typoGraphic = (groupId, text, pos) => {
            this.svg.append('text')
                .text(text)
                .attr('class', groupId)
                .attr('font-family', 'NanumSquare')
                .attr('font-size', '22px').attr('fill', '#f5eeda')
                .attr('letter-spacing', 1)
                // .attr('text-anchor', 'middle')
                .attr('x', pos.x).attr('y', pos.y)
        }

        let text
        if (render.left.city != undefined) {
            this.svg.selectAll(`.${render.left.group_id}`).remove()
            text = WeatherWidget.toKR(render.left.city) + ` ${Math.round(render.left.temp)} ℃`
            infoGraphic(render.left.group_id, render.left.guessIcon, render.left.pos.icon)
            typoGraphic(render.left.group_id, text, render.left.pos.typo)
        }

        if (render.right.city != undefined) {
            this.svg.selectAll(`.${render.right.group_id}`).remove()
            text = WeatherWidget.toKR(render.right.city) + ` ${Math.round(render.right.temp)} ℃`
            infoGraphic(render.right.group_id, render.right.guessIcon, render.right.pos.icon)
            typoGraphic(render.right.group_id, text, render.right.pos.typo)
        }
    }

    /**
     * 오늘의 명언 데이터를 그린다
     * @param String maxim 
     */
    drawMaxim(maxim)
    {
        const groupId = 'maxim'
        const lineMargin = 28
        this.svg.selectAll(`.${groupId}`).remove()

        maxim = maxim.split(/\n/)
        maxim = _.filter(maxim)
        console.log(maxim)

        _.each(maxim, (line, idx) => {
            let lastLine = ((maxim.length - 1) == idx) ? 15 : 0;

            this.svg.append('text')
                .text(line)
                .attr('class', groupId)
                .attr('font-family', 'NanumSquare')
                .attr('font-size', '24px')
                .attr('fill', '#303b4b')
                .attr('letter-spacing', 0)
                .attr('text-anchor', 'middle')
                // .attr('width', 150)
                .attr('x', 360)
                .attr('y', 1330 + (idx * lineMargin) + lastLine)
        })
    }

    /**
     * 뉴스를 
     * @param Array stack 
     */
    drawNews(stack)
    {
        const groupId = 'news'
        const lineMargin = 46

        this.svg.selectAll(`.${groupId}`).remove()

        _.each(stack, (news, idx) => {
            let text = this.svg.append('text')
                .text(`∙ ${news.title}`)
                .attr('class', groupId)
                .attr('font-family', 'gulim')
                .attr('font-size', '26px')
                .attr('letter-spacing', -1)
                .attr('fill', '#4c4d4d')
                .attr('x', 60)
                .attr('y', 330 + (idx * lineMargin))

            if (news.type == 'focus' || news.type == 'headline') {
                text.attr('font-weight', 'bolder')
            }

            if (news.type == 'focus') {
                text.attr('fill', '#365683')
            }
        })
    }

    /**
     * SVG로 그려진 이름을 다운로드 한다 
     */
    download()
    {
        saveSvgAsPng(document.getElementById('svg'), `${moment().format('YYYY-MM-DD')}_허경일_뉴스.png`)
    }
}