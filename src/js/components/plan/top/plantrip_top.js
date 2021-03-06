import React, { Component } from "react";
import "../../../../scss/plantrip_top.scss";

class PlanTripTop extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.list = {
            categoryArray: ["All", "Transport", "Lodge", "Food", "Activity"]
        };
    }
    render() {
        let categoryArrayDOM = this.list.categoryArray.map((item, index) => (
            <li
                key={`category_${index}`}
                onClick={() => this.props.handleCategoryChange(item)}
                className={
                    this.props.planTripState.category === item
                        ? "current"
                        : null
                }
            >
                {item}
            </li>
        ));
        return (
            <div className="top">
                <div className="del">
                    <div onClick={() => this.props.handlePopup("del_trip")}>
                        del
                    </div>
                </div>
                <div className="top_text">
                    <div className="title_date">
                        <ul
                            onClick={() =>
                                this.props.handleOpenAddPlan({
                                    value: "EDIT",
                                    id: this.props.state.current_trip
                                })
                            }
                        >
                            <li className="title">
                                {this.props.planState.name}
                            </li>
                            <li className="date">{`${
                                this.props.planState.start
                            } - ${this.props.planState.end}`}</li>
                        </ul>
                    </div>
                    <div className="tab">
                        <ul className="clearfix">{categoryArrayDOM}</ul>
                    </div>
                </div>
            </div>
        );
    }
}
export default PlanTripTop;
