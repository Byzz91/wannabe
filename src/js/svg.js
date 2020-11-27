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
     * 
     */
    download()
    {
        saveSvgAsPng(document.getElementById('svg'), `${moment().format('YYYY-MM-DD')}_허경일_뉴스.png`)
    }
}