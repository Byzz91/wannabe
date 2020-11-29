import { Widget } from "./widget";
import $ from 'jquery'
import _ from 'lodash'
import moment from 'moment'

export class FinanceWidget extends Widget
{
    /**
     * Constructor
     * @param jQuery $binder 
     * @param SVG svg 
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
     * boot
     */
    async boot()
    {
        if (this.data == null) {
            this.data = await super.doApi('/heo/finance')
        }

        if (!_.isObject(this.data)) {
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
        console.log(this.data)

        html.push(`
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>${moment(this.data.created_at).fromNow()}</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `)

        _.each(this.data.finance, (finance, idx) => {
            let arrow = (finance.updown == '상승') ? '▲' : '▼'
            let arrowCls = (finance.updown == '상승') ? 'up' : 'down'

            html.push(`
            <li class="media">
                <span class="point ${arrowCls}">${arrow} ${finance.status}</span>
                <div class="media-body">
                    <h5 class="mt-0 mb-1">${finance.title}</h5>
                    <span>${finance.point}</span>
                </div>
            </li>
            `)
        })

        $('#widget-finance-contents > ul').html(html.join('\r\n'))
        $('.alert').alert() // bs5
        this.handle()

        super.done()
    }

    /**
     * 실제 그려질 데이터를 정리 후 SVG 객체로 전달
     */
    handle()
    {
        this.svg.drawFinance(this.data.finance)
    }
}