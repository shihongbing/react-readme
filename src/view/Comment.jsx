import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";

import Typography from "@material-ui/core/Typography";
import commentStyle from "assets/jss/components/question/commentStyle";
import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    const { classes, data, index} = this.props;
    const {} = this.props;
    console.log(this.props)
    return (
      <Grid container spacing={8} wrap="nowrap">
        <Grid item>
          <Avatar className={classes.orangeAvatar}>N</Avatar>
        </Grid>
        <Grid item>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography bold inline={true}>
                {data.username}
              </Typography>{" "}
              <Typography light="true" inline={true}>
                #{index+1}
              </Typography>{" "}
              <Typography light="true" inline={true}>
                ·
              </Typography>{" "}
              <Typography light="true" inline="true">
                {data.create_time}
              </Typography>
              <Typography>
                {data.content}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <IconButton danger={true}>
                <Icon light={true} text={true}>
                  favorite_border
                </Icon>
              </IconButton>
              <Typography light={true} inline={true} danger={true}>
                661
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(commentStyle)(Comment);
