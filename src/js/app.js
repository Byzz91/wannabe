import $ from "jquery"
import "bootstrap/dist/js/bootstrap.bundle"
import { WeatherWidget } from './weatherWidget'
import "../style/app.scss"
// import { Canvas } from "./canvas"
import { SVG } from './svg'
import { MaximWidget } from "./maximWidget"
import { NewsWidget } from "./newsWidget"
import { FinanceWidget } from './financeWidget'
import { CovidWidget } from "./covidWidget"

class App
{
    appName = '허팀장 Generator'
    appVersion = 1.1

    /**
     * App Constructor
     */
    constructor()
    {
        this.svg = new SVG()
        this.widget = {}
        
        /**
         * Widget Instance
         */
        this.widget.weather = new WeatherWidget($('#weather-widget'), this.svg)
        this.widget.maxim = new MaximWidget($('#maxim-widget'), this.svg)
        this.widget.news = new NewsWidget($('#news-widget'), this.svg)
        this.widget.finance = new FinanceWidget($('#finance-widget'), this.svg)
        this.widget.covid = new CovidWidget($('#covid-widget'), this.svg)

        this.data = {}
        this.install()
    }

    /**
     * App Install
     */
    install()
    {
        $('[data-app-name]').text(`${this.appName} v${this.appVersion}`)

        // 캔바스에 가이드 이미지를 올린다
        this.svg.drawGuide()

        // 캔바스에 오늘 날짜를 그린다
        this.svg.drawCurrentDatetime()

        // 다운로드 버튼 바인딩
        $('#download-image').on('click', this.svg.download.bind(this.svg))

        // 페이지 새로고침 막기
        if (location.host != '127.0.0.1:7777') {
            window.onbeforeunload = () => '페이지가 새로고침 됩니다. 그래도 하시겠습니까?'
        }
    }

    /**
     * App Prepare
     */
    prepare()
    {
    }

    /**
     * App Done
     */
    done()
    {
    }

    /**
     * 데이터를 저장
     * @param String key 
     * @param Mixed value 
     */
    addData(key, value)
    {
        this.data[key] = value
    }

    /**
     * 저장된 데이터를 가져옴
     * @param Mixed key 
     */
    get(key)
    {
        return this.data[key]
    }
}

window.instance = new App()