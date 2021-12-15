import React from "react";
import { Box, Chip, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  boldPreviewText: {
    fontSize: 12,
    color: "#000000",
    letterSpacing: -0.17,
    fontWeight: 550,
  },
  chip: {
    marginTop: "2.5%",
    marginRight: "2%",
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser, unreadMessageCount } = conversation;

  return (
    <Grid className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography
          className={
            unreadMessageCount > 0
              ? classes.boldPreviewText
              : classes.previewText
          }
        >
          {latestMessageText}
        </Typography>
      </Box>
      {unreadMessageCount > 0 && (
        <Chip
          item
          label={unreadMessageCount}
          size="small"
          color={"primary"}
          className={classes.chip}
        />
      )}
    </Grid>
  );
};

export default ChatContent;
