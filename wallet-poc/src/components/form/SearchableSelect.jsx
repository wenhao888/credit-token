import React, {Component} from "react"
import {Select} from "antd"


class SearchableSelect extends Component {
  render() {
    let properties = this.props || {};
    return (
      <Select {...properties} showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      />
    )
  }
}

export default SearchableSelect
