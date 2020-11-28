import { Widget } from "./widget";
import moment from 'moment'
import $ from 'jquery'

export class NewsWidget extends Widget
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
        this.newsStack = []

        // 메뉴 클릭 바인딩
        super.bindClick(this.$binder, this.boot.bind(this))

        let debHandle = _.debounce(this.handle.bind(this), 50)
        $('body').on('change', 'input[name="news[]"]', debHandle)
    }

    /**
     * 메뉴 클릭 후 발동하는 메소드 
     */
    async boot()
    {
        this.data = await super.doApi('/heo/news')

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

        html.push(`
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>${moment(this.data.created_at).fromNow()}</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `)

        _.each(['focus', 'headline', 'comments'], (group, __) => {
            let title = String()

            switch (group) {
                case 'focus':
                    title = '주요 포커스'
                break
                case 'headline':
                    title = '헤드라인'
                break
                case 'comments':
                    title = '댓글 많이 달린'
                break
            }
            
            html.push(`<h4 class="news-group">${title}</h4>`)

            _.each(this.data.daum_news[group], (news, idx) => {
                let id = `${group}_${idx}`

                html.push(`
                <div class="media">
                    <input type="checkbox" name="news[]" value="1" id="${id}" class="align-self-center mr-3">
                    <div class="media-body">
                        <a href="${news.link}" data-type="${group}" target="_blank">${news.text}</a>
                    </div>
                </div>
                `)
            })
        })

        $('#widget-news-contents').html(html.join('\r\n'))
        $('.alert').alert() // bs5

        super.done()
    }

    /**
     * 실제 데이터 변동이 있으면 데이터를 구해서 드로잉
     * @scope checkbox
     */
    handle(e)
    {
        let $chk = $(e.target)
        let id = $chk.attr('id')
        let $parent = $chk.closest('.media')
        let $news = $parent.find('.media-body > a')

        if ($chk.is(':checked')) {
            this.newsStack.push({
                id: id,
                type: $news.attr('data-type'),
                link: $news.attr('href'),
                title: $news.text()
            })
        } else {
            _.remove(this.newsStack, r => (r.id == id))
        }

        this.svg.drawNews(this.newsStack)
    }
}