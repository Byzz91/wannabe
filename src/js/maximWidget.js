import { Widget } from "./widget";
import $ from 'jquery'
import { shuffle } from "lodash";

/**
 * 오늘의 명언을 가져와주는 클래스 
 */
export class MaximWidget extends Widget
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
        this.data = null // 명언이 저장될 변수 
        this.shuffled = [] // 명언이 셔플 후 저장된 변수

        // 메뉴 클릭 바인딩 
        super.bindClick(this.$binder, this.boot.bind(this))

        // 각 명언을 클릭했을 때 
        $('body').on('click', '.container-maxim .media', this.trigger.bind(this))

        // textarea를 클릭 했을 때
        let debHandle = _.debounce(this.handle.bind(this), 300)
        $('body').on('focus keyup', 'textarea[name="custom_message"]', debHandle)
    }

    /**
     * 메뉴 클릭 후 명언 데이터와 명언 페이지를 불러옴 
     */
    async boot()
    {
        if (this.data == null) {
            this.data = await $.get('./widget/maxim.json')
        }

        this.prepare()
    }

    /**
     * 데이터 정리 
     */
    prepare()
    {
        let html = []
        this.shuffled = _.shuffle(this.data).slice(0, 50)

        html.push(`
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>총 ${this.data.length}개</strong> 중 50개씩 랜덤 노출
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `)

        _.each(this.shuffled, (maxim, idx) => {
            html.push(`
            <div class="media">
                <input type="radio" name="maxim" value="${idx}" class="align-self-center mr-3" id="maxim${idx}">
                <div class="media-body">
                    <label for="maxim${idx}"><h5 class="mt-0">${maxim.author}</h5></label>
                    <label for="maxim${idx}">
                        <p>${maxim.message}</p>
                    </label>
                </div>
            </div>
            `)
        })

        $('#widget-maxim-contents').html(html.join('\r\n'))
        $('.alert').alert() // bs5

        super.done()
    }

    /**
     * 각 명언들이 클릭됐을 때 발생하는 트리거
     */
    trigger()
    {
        let $input = $('[name="maxim"]:checked')
        let $body = $input.closest('.media').find('.media-body')
        let cursor = _.toInteger($input.val())
        let maximOne = this.shuffled[cursor]

        if ($body.find('textarea').length > 0) {
            return
        }

        // hide labels
        $body.find('label').hide()
        let text = `
${maximOne.message}
- ${maximOne.author} -
`
        $body.append(`<textarea class="textarea" name="custom_message">${text}</textarea>`)
    }

    /**
     * 실제 데이터를 정리하여 캔바스에 넘겨줌
     * 명언 위젯에서는 각 명언(radio)를 클릭했을 때 실행 
     */
    handle()
    {
        let customText = $('[name="maxim"]:checked').closest('.media').find('textarea')

        this.svg.drawMaxim(customText.val())
    }
}