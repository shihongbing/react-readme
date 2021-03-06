import React, { Component } from "react";
import { Document, Page } from "react-pdf/dist/entry.webpack";
import { withStyles } from "@material-ui/core";
import pdfviewerStyle from "assets/jss/components/pdfviewer/pdfviewerStyle";
import QPoint from "view/QPoint";
import QuestionDialog from "view/QuestionDialog";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actions as frontActions } from "reducers/frontReducer";
import Pagination from "components/pagination/Pagination.jsx";

class PDFViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pdfName: "ch1.pdf",
      numPages: null,
      pageNumber: 1,
      pages: [],
      width: 1000,
      questions: [],
      activeQuestion: null,
      isOpenQuestionDialog: false,
      isAddingQuestion: false,
    };
    this.posX = 0;
    this.posY = 0;
    this.onCloseQuestionDialog.bind(this);
  }

  onDocumentLoadSuccess = (pdf) => {
    this.setState({ numPages: pdf.numPages});
  };
  onPageLoadSuccess = ({height}) => {
    this.props.setHeight(height);
    this.setState({pageNumber: this.state.pageNumber})
    this.onChangePage(this.state.pageNumber)
    this.props.getQuestions({ pageNum: this.state.pageNumber, pdfName: this.state.pdfName });
  };


  onCloseQuestionDialog= function() {
    this.setState({ isOpenQuestionDialog: false });
  }.bind(this);

  componentWillReceiveProps(nextProps) {
    this.setState({ 
      questions: nextProps.questions,
      userInfo: nextProps.userInfo,
      isAddingQuestion: nextProps.isAddingQuestion, 
      pdfName: nextProps.pdfName,
      activeQuestion: nextProps.activeQuestion
    });
    this.state.pageNumber = nextProps.pageNumber
    if(nextProps.msg.type===1 && nextProps.msg.content ==='post question') {
      this.props.getQuestions({ pageNum: this.state.pageNumber, pdfName: this.state.pdfName });
    }
  }

  onChangePage = text => {
    if (text === "...") {
      return;
    } else if (text === "PREV") {
      if (this.state.pageNumber <= 1) return;
      text = this.state.pageNumber - 1;
    } else if (text === "NEXT") {
      if (this.state.pageNumber >= this.state.numPages) return;
      text = this.state.pageNumber + 1;
    }
    this.props.getQuestions({ pageNum: text, pdfName: this.state.pdfName });
    this.props.changePdf(this.state.pdfName, text)
    this.setState({
      pages: this.calPageList(text, this.state.numPages)
    });
  };

  calPageList = (num, last) => {
    var pages = [{ text: "PREV" }];
    if (num - 5 > 1) {
      pages.push({ text: 1 });
      pages.push({ text: "..." });
    }
    for (var i = num - 5; i <= num + 5; i++) {
      if (i < 1 || i > last) continue;
      var tmp = {};
      tmp.text = i;
      if (i === num) {
        tmp.active = true;
      }
      pages.push(tmp);
    }
    if (num + 5 < last) {
      pages.push({ text: "..." });
      pages.push({ text: last });
    }

    pages.push({ text: "NEXT" });
    return pages;
  };

  render() {
    const { pageNumber, numPages, width, questions } = this.state;
    const { classes, activeQuestion} = this.props;
    return (
      <div>
        <Document
          file={this.state.pdfName}
          onLoadSuccess={this.onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            width={width}
            onLoadSuccess={this.onPageLoadSuccess}
          />
        </Document>
        <div
          className={classes.mask}
          onClick={e => {
            if (this.state.isAddingQuestion) {
              if(!this.state.userInfo.username) {
                alert("please login first")
                return;
              }
              this.posX = e.nativeEvent.offsetX - 24;
              this.posY = e.nativeEvent.offsetY - 24;
              this.setState({ isOpenQuestionDialog: true });
            }
          }}
          id="mask"
        >
          {questions.map((question, index) => {
            return (
              <QPoint
                question={question}
                opacity={(activeQuestion && activeQuestion.id === question.id)? 0.8:0.4}
                onUpdateQuestion={e => {
                  this.props.onUpdateQuestion(question);
                }}
              />
            );
          })}
        </div>
        <QuestionDialog
          open={this.state.isAddingQuestion & this.state.isOpenQuestionDialog}
          close={this.onCloseQuestionDialog}
          pageNumber={this.state.pageNumber}
          pdfName={this.state.pdfName}
          posX={this.posX}
          posY={this.posY}
        />
        <div style={{ textAlign: "center" }}>
          <Pagination
            onClick={(text) => {
              this.props.changeActiveQuestion(null)
              this.onChangePage(text)}
            }
            pages={this.state.pages}
            color="info"
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    userInfo: state.globalState.userInfo,
    questions: state.front.questions,
    isAddingQuestion: state.front.isAddingQuestion,
    pdfName: state.front.pdfName,
    msg: state.globalState.msg,
    pageNumber: state.front.pageNumber,
    activeQuestion: state.front.activeQuestion
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getQuestions: bindActionCreators(frontActions.get_questions, dispatch),
    changePdf: bindActionCreators(frontActions.change_pdf, dispatch),
    changeActiveQuestion: bindActionCreators(frontActions.change_active_question, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(pdfviewerStyle)(PDFViewer));
