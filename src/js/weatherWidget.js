import { Widget } from './widget'
import $, { when } from 'jquery'
import _ from 'lodash'

export class WeatherWidget extends Widget
{
    /**
     * Constructor
     * @param jQuery $binder 
     * @param SVG Canvas Instance
     */
    constructor($binder, svg)
    {
        super($binder)

        this.$binder = $binder
        this.svg = svg
        this.data = null

        // 메뉴 클릭 바인딩
        super.bindClick(this.$binder, this.boot.bind(this))

        $('body').on(
            'change', 
            '[name="weather-left"], [name="weather-right"]', 
            this.handle.bind(this)
        )
    }

    /**
     * 메뉴 클릭 후 발동하는 메소드
     */
    async boot()
    {
        if (this.data == null) {
            this.data = await super.doApi('/heo/weather')
        }
        
        if (!_.isObject) {
            window.alert('데이터를 불러올 수 없습니다.')
            return
        }

        this.prepare()
    }

    /**
     * 데이터 정리
     */
    prepare()
    {
        let html = []

        _.each(this.data, (data, city) => {
            html.push(`
                <li>
                    <label>
                        <input type="radio" name="$direction" value="${city}">
                        <span class="dl city-name">${this.toKR(city)}</span>
                        <span class="dl temp">temp: ${data.main?.temp}</span>
                        <span class="dl temp-min">temp-min: ${data.main?.temp_min}</span>
                        <span class="dl temp-max">temp-max: ${data.main?.temp_max}</span>
                        <span class="dl weather">(${data.weather[0]?.description})</span>
                    </label>
                </li>
            `)
        })

        let leftOpts = html.join('\r\n').replace(/\$direction/g, 'weather-left')
        let rightOpts = html.join('\r\n').replace(/\$direction/g, 'weather-right')

        $('#left-weather').append(leftOpts)
        $('#right-weather').append(rightOpts)

        super.done()
    }

    /**
     * 도시이름을 한글이름으로 바꿈
     * @param String eng 
     */
    toKR(eng)
    {
        eng = eng.toLowerCase()

        switch (eng) {
            case 'seoul':
                return '서울'
            case 'busan':
                return '부산'
            case 'hongsung':
                return '홍성 💋'
            case 'daegu':
                return '대구'
            default:
                return eng
        }
    }

    /**
     * 날씨를 통해 아이콘을 추출함
     * 
     * <option value="1">번개</option>
     * <option value="2">비 + 번개</option>
     * <option value="3">눈 많음</option>
     * <option value="4">눈 적음</option>
     * <option value="5">비 + 눈</option>
     * <option value="6">비 많음</option>
     * <option value="7">비 적음</option>
     * <option value="8">바람</option>
     * <option value="9">흐림 + 번개</option>
     * <option value="10">흐림 + 비</option>
     * <option value="11">구름많음</option>
     * <option value="12">흐림</option>
     * <option value="13">맑음</option>
     * 
     * @param String weather 
     */
    static guessInfoGraphic(weather)
    {
        weather = weather.toLowerCase()

        if (weather.indexOf('clouds') >= 0) {
            return '11'
        } else if (weather.indexOf('rain') >= 0) {
            return '02'
        } else if (weather.indexOf('snow') >= 0) {
            return '03'
        } else if (weather.indexOf('clear') >= 0) {
            return '13'
        } else if (weather.indexOf('wind') >= 0) {
            return '08'
        } else if (weather.indexOf('thunder') >= 0) {
            return '01'
        } else {
            // default, not found
            return '13'
        }
    }

    /**
     * 실제 데이터를 정리하여 캔바스에 넘겨줌
     */
    handle()
    {
        let render = {
            left: {
                group_id: 'group-l-w',
                city: $('[name="weather-left"]:checked').val(),
                guessIcon: null,
                data: null,
                pos: {
                    x: 500,
                    y: 52
                }
            },
            right: {
                group_id: 'group-r-w',
                city: $('[name="weather-right"]:checked').val(),
                guessIcon: null,
                data: null,
                pos: {
                    x: 607,
                    y: 52
                }
            }
        }

        if (render.left.city != undefined) {
            render.left.data = this.data[render.left.city]
            render.left.guessIcon = WeatherWidget.guessInfoGraphic(render.left.data.weather[0]?.description)
            render.left.guessIcon = `./assets/weather_${render.left.guessIcon}.png`
        }
        
        if (render.right.city != undefined) {
            render.right.data = this.data[render.right.city]
            render.right.guessIcon = WeatherWidget.guessInfoGraphic(render.right.data.weather[0]?.description)
            render.right.guessIcon = `./assets/weather_${render.right.guessIcon}.png`
        }

        this.svg.drawWeather(render)
    }
}