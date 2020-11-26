import $ from "jquery"
import "bootstrap/dist/js/bootstrap.bundle"
import { WeatherWidget } from './weatherWidget'
import "../style/app.scss"

class App
{
    appName = 'Wannabe Generator'
    appVersion = 0.1

    /**
     * App Constructor
     */
    constructor()
    {
        this.install()
    }

    /**
     * App Install
     */
    install()
    {
        $('[data-app-name]').text(`${this.appName} v${this.appVersion}`)

        new WeatherWidget($('#weather-widget'))
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
}

new App()