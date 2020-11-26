import $ from 'jquery'

export class Widget
{
    /**
     * Constructor
     * @param jQuery $binder 
     */
    constructor($binder)
    {
        this.$contents = $('#contents')
        this.$binder = $binder
        this.bind()
    }

    /**
     * Add EventListener
     */
    bind()
    {
        this.$binder.on('click', function () {
            let $self = $(this)
            let loadUrl = $self.attr('data-load-url')

            $.get(loadUrl).then(r => $('#contents').html(r))
        })
    }
}