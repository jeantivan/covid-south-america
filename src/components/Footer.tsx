import {
  Container,
  Grid,
  Link,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
const useStyles = makeStyles((theme) => ({
  footer: {
    background: theme.palette.background.paper,
    padding: theme.spacing(3, 0),
  },
}));
export const Footer: React.FC = () => {
  const classes = useStyles();
  return (
    <footer id="footer" className={classes.footer}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography align="center">
              Data from{" "}
              <Link
                href="https://covid19api.com/"
                target="_blank"
                rel="noopener noreferrer"
                title="COVID19 API"
              >
                COVID19 API
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align="center" variant="body2">
              Created by{" "}
              <Link href="https://github.com/jptivan53" title="Jean Tivan">
                Jean Tivan
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};
