import $ from 'jquery'
import * as d3 from 'd3'
import { saveSvgAsPng } from 'save-svg-as-png'
import 'moment/locale/ko'
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

        // moment
        moment.locale('ko')
    }

    /**
     * 오늘날짜를 그린다
     */
    drawCurrentDatetime()
    {
        let createDatetime = moment().format('YYYY. MM. DD (ddd) HH:mm')

        this.svg.append('text')
            .text(createDatetime)
            .attr('font-family', 'NanumSquare')
            .attr('font-size', 20)
            .attr('fill', '#4c4d4d')
            .attr('letter-spacing', -1)
            .attr('x', 450)
            .attr('y', 277)
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
     * 뉴스
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
                .attr('font-family', 'NanumGothic')
                .attr('font-size', 22)
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
     * 코스피 등을 그린다
     */
    drawFinance(finance)
    {
        console.log(finance)
        const groupId = 'finance'
        const leftMargin = 200
        const leftStart = 150
        const topStart = 1160

        this.svg.selectAll(`.${groupId}`).remove()

        _.each(finance, (fnc, idx) => {
            let arrow = (fnc.updown == '상승') ? '▲' : '▼'
            let arrowColor = (fnc.updown == '상승') ? '#fa3232' : '#0064b4'

            // 예) 코스피
            this.svg.append('text')
                .text(fnc.title)
                .attr('class', groupId)
                .attr('font-family', 'NanumSquare')
                .attr('font-size', 26)
                .attr('letter-spacing', -1)
                .attr('text-anchor', 'middle')
                .attr('fill', '#4c4d4d')
                .attr('x', leftStart + (idx * leftMargin))
                .attr('y', topStart)
            
            // 예) 2617.76
            this.svg.append('text')
                .text(fnc.point)
                .attr('class', groupId)
                .attr('font-family', 'NanumSquare')
                .attr('font-size', 34)
                .attr('letter-spacing', 0)
                .attr('text-anchor', 'middle')
                .attr('fill', '#252729')
                .attr('x', leftStart  + (idx * leftMargin))
                .attr('y', topStart + 50)

            this.svg.append('text')
                .text(`${arrow} ${fnc.status}`)
                .attr('class', groupId)
                .attr('font-family', 'NanumSquare')
                .attr('font-size', 20)
                .attr('font-weight', 'bold')
                .attr('letter-spacing', 0)
                .attr('text-anchor', 'middle')
                .attr('fill', arrowColor)
                .attr('x', leftStart + (idx * leftMargin))
                .attr('y', topStart + 80)
        })
    }

    /**
     * 코비드 상황판을 그린다
     * @param Object data 
     */
    drawCovid(data)
    {
        console.log(data)
        const groupId = 'covid'
        const leftMargin = 150
        const leftStart = 150
        const topStart = 1025

        this.svg.selectAll(groupId).remove()

        this.svg.append('svg:image')
            .attr('xlink:href', './assets/gov.png')
            .attr('class', groupId)
            .attr('x', 60)
            .attr('y', 953)
            .attr('width', 25)
            .attr('height', 25)

        this.svg.append('text')
            .text('코로나 국내 발생 현황')
            .attr('class', groupId)
            .attr('font-family', 'NanumSquare')
            .attr('font-size', 18)
            .attr('letter-spacing', -1)
            .attr('font-weight', 'bold')
            .attr('fill', '#4c4d4d')
            .attr('x', 90)
            .attr('y', 970)

        this.svg.append('text')
            .text(data['기준시각'])
            .attr('class', groupId)
            .attr('font-family', 'NanumSquare')
            .attr('font-size', 18)
            .attr('letter-spacing', -1)
            .attr('fill', '#5c5c5c')
            .attr('x', 520)
            .attr('y', 973)

        _.each(['확진환자', '격리해제', '격리중', '사망'], (key, idx) => {
            this.svg.append('text')
                .text(key)
                .attr('class', groupId)
                .attr('font-family', 'NanumSquare')
                .attr('font-size', 26)
                .attr('letter-spacing', -1)
                .attr('text-anchor', 'middle')
                .attr('fill', '#4c4d4d')
                .attr('x', leftStart + (idx * leftMargin))
                .attr('y', topStart)

            let color = data[key].substr(0, 1) == '+' ? '#fa3232' : '#0064b4'

            this.svg.append('text')
                .text(data[key])
                .attr('class', groupId)
                .attr('font-family', 'NanumSquare')
                .attr('font-size', 32)
                .attr('font-weight', 'bold')
                .attr('letter-spacing', 0)
                .attr('text-anchor', 'middle')
                .attr('fill', color)
                .attr('x', leftStart + (idx * leftMargin))
                .attr('y', topStart + 40)
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