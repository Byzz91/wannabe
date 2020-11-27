import $ from 'jquery'
import _ from 'lodash'

export class Widget
{
    /**
     * Constructor
     * @param Widget children
     */
    constructor()
    {
        this.env = this.environment()

        if (this.env == 'dev') {
            this.apiHost = '//vaplay.test'
        } else {
            this.apiHost = '//vaplay.kr'
        }
    }

    /**
     * 개발환경 분석
     * @return String dev|prod
     */
    environment()
    {
        return (location.host == '127.0.0.1:7777') ? 'dev' : 'prod'
    }

    /**
     * 준비 중인 이펙트 추가하기 (데이터를 가져오고 처리하는 이펙트)
     */
    preparing()
    {
        $('#progress').removeClass('hidden')
        $('#contents').addClass('ready')
    }

    /**
     * 작업이 완료되면 이펙트 숨긴다
     */
    done()
    {
        $('#progress').addClass('hidden')
        $('#contents').removeClass('ready')
    }

    /**
     * 이벤트리스너를 바인딩
     * scope의 유의해야한다.
     */
    async bindClick($binder, boot)
    {
        let preparing = this.preparing.bind(this)

        // 각 메뉴 클릭시 실행되는 명령어
        $binder.on('click', function () {
            let $self = $(this)
            let loadUrl = $self.attr('data-load-url').trim()

            preparing()
            $self.closest('.list-group').find('button').removeClass('active')
            $self.addClass('active')

            $.get(loadUrl).then(r => {
                $('#contents').removeClass('align-center').html(r)

                if (_.isFunction(boot)) {
                    boot()
                }    
            })
        })
    }

    /**
     * Ajax호출을 Async 호출로 실행
     * @param String pathname 
     * @param Object parameters 
     * @return Promise
     */
    async doApi(pathname, parameters = {})
    {
        let result = await $.ajax({
            crossDomain: true,
            async: true,
            dataType: 'json',
            url: `${this.apiHost}${pathname}`,
            type: 'GET',
            data: parameters
        })

        return result
    }
}