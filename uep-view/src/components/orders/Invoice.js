import * as React from "react";
import '../../static/style/invoice.scss';

export class Invoice extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = { checked: false };
    }

  canvasEl;

  componentDidMount() {
      if (!this.canvasEl) return;
      const ctx = this.canvasEl.getContext("2d");
      if (ctx) {
          ctx.beginPath();
          ctx.arc(95, 50, 40, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.fillStyle = "rgb(200, 0, 0)";
          ctx.fillRect(85, 40, 20, 20);
          ctx.save();
      }
  }

  handleCheckboxOnChange = () =>
      this.setState({ checked: !this.state.checked });

  setRef = (ref) => (this.canvasEl = ref);

  render() {
      var __html = require('./index.js');
      var orderInvoice = { __html: __html };
      const { invoice_details } = this.props;

      return (
          <div className="relativeCSS">
              <style type="text/css" media="print">
                  {"\
          @page { size: landscape; }\
          "}
              </style>
              <div className="flash" />
              <div>
                  <img
                      alt="Invoice"
                      src= { invoice_details }
                  />
              </div>
          </div>
      );
  }
}

export const FunctionalComponentToPrint = React.forwardRef((props, ref) => {
    return <Invoice ref={ ref } invoice_details={ props.invoice_details } />;
});
