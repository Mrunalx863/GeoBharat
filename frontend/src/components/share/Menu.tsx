import ChartWidget from "./ChartWidget"
import ChartWidget3 from "./ChartWidget3"
import ChartWidget2 from "./ChartWidget2"
import ChartWidgetAqi from "./ChartWidgetAqi"
import ChartWidgetNo2 from "../ChartWidgetNo2"
import ChartWidgetO3 from "../ChartWidgetO3"


const Menu = () => {
    return (
        <>
            <div className="dropdown top-[90vh] left-2 dropdown-top dropdown-right">
                <div tabIndex={0} role="button" className="btn btn-circle ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 256 256"><path d="M104,40H56A16,16,0,0,0,40,56v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,104,40Zm0,64H56V56h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Zm0,64H152V56h48v48Zm-96,32H56a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,104,136Zm0,64H56V152h48v48Zm96-64H152a16,16,0,0,0-16,16v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V152A16,16,0,0,0,200,136Zm0,64H152V152h48v48Z"></path></svg>
                </div>
                <div tabIndex={0} className="dropdown-content card bg-base-100 rounded-box z-[1] w-96 p-2 shadow">

                    <div className="card-body items-center">
                        <div role="tablist" className="tabs tabs-bordered w-full ">
                            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="NDVI"  />
                            <div role="tabpanel" className="tab-content py-4">
                                <ChartWidget />
                            </div>

                            <input
                                type="radio"
                                name="my_tabs_1"
                                role="tab"
                                className="tab"
                                aria-label="C0"
                            />
                            <div role="tabpanel" className="tab-content py-4"><ChartWidget2 /></div>

                            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Rainkoko" />
                            <div role="tabpanel" className="tab-content py-4"><ChartWidget3 /></div>

                            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="AQI" defaultChecked/>
                            <div role="tabpanel" className="tab-content py-4">
                                <ChartWidgetAqi />
                            </div>

                            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="NO₂" />
                            <div role="tabpanel" className="tab-content py-4"><ChartWidgetNo2 /></div>

                            <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="O₃" />
                            <div role="tabpanel" className="tab-content py-4"><ChartWidgetO3 /></div>
                        </div>
                    </div>

                </div>
            </div>


        </>
    )
}

export default Menu