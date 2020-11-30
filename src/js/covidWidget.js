import { Widget } from "./widget";
import $ from 'jquery'

export class CovidWidget extends Widget
{
    /**
     * Constructor
     * @param jQuery $binder 
     * @param svg svg 
     */
    constructor($binder, svg)
    {
        super($binder)

        this.$binder = $binder
        this.svg = svg
        this.data = null

        super.bindClick(this.$binder, this.boot.bind(this))

    }

    /**
     * 메뉴 클릭 후 발동하는 메소드
     */
    async boot()
    {
        this.data = await super.doApi('/heo/covid19')

        if (!_.isObject(this.data)) {
            window.alert('데이터를 불러올 수 없습니다.')
            return
        }

        this.prepare()
    }

    /**
     * 데이터 정리 후 실제 화면에 출력 
     */
    prepare()
    {
        let html = []
        console.log(this.data)

        html.push(`
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>${this.data['기준시각']}</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `)

        _.each(['격리중', '격리해제', '사망', '확진환자'], (key, _) => {
            html.push(`
            <li class="media">
                <span class="point">${this.data[key]}</span>
                <div class="media-body">
                    <h5 class="mt-0 mb-1">${key}</h5>
                </div>
            </li>
            `)
        })

        $('#widget-covid-contents > ul').html(html.join('\r\n'))
        $('.alert').alert()

        this.handle()
        super.done()
    }

    /**
     * SVG로 데이터 전달
     */
    handle()
    {
        this.svg.drawCovid(this.data)
    }
}