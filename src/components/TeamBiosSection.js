import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import { useHistory, Link } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  avatarWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

function TeamBiosSection(props) {
  const classes = useStyles();
  const history = useHistory()

  const items = [
    {
      avatar: "https://media-exp1.licdn.com/dms/image/C4D03AQE3aZbAbMY7lA/profile-displayphoto-shrink_800_800/0/1595632794023?e=1656547200&v=beta&t=U5R3KmwdrVoxFV07JQ0ukxcdLxkAgW8IEuiqDaM5hIY",
      name: "Khurram Mustafa",
      link: "LinkedIn",
      bio: "For my whole life I have been dealing with burst of motivation where I am extremely productive for several days, followed by weeks long slumps. This yo-yo behavior does not let a person develop their skills or build anything substantial. According to my observations, people usually start working towards a goal following a temporary spike in motivation. It lasts a few days at most. Usually, it is not enough for people to move past the hurdle that is the first 2 weeks. In the first 2 weeks of starting anything new, you are garbage at everything. It hard work and not very rewarding because you are constantly getting things wrong and not being able to get in flow. However, after 2 weeks so, People start appreciating the task. They finally see hints of progression of their abilities. Are able to work for longer stretches at a time before running into something frustrating. This allows them to get into flow. Together this starts to produce consistent internal motivation that allows the person to actually stick with the new habit long term. But 99% of the time people give up before getting here. To address this issue, I created WorkOrPay",
    },
    // {
    //   avatar: "",
    //   name: "William Chan",
    //   role: "Add your link",
    //   bio: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum consequatur numquam aliquam tenetur ad amet inventore hic beatae, quas accusantium perferendis sapiente explicabo, corporis totam! Labore reprehenderit beatae magnam animi!",
    // },
  ];

  return (
    <Section
      bgColor={props.bgColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={4}
          textAlign="center"
        />
        <Grid container={true} justifyContent="center" spacing={4}>
          {items.map((item, index) => (
            <Grid item={true} xs={12} sm={6} md={4} key={index}>
              <Card className={classes.card}>
                <CardContent>
                  <Box className={classes.avatarWrapper}>
                    <Avatar
                      src={item.avatar}
                      alt={item.name}
                      className={classes.avatar}
                    />
                  </Box>
                  <Box textAlign="center" pt={3}>
                    <Typography variant="body2" component="p">
                      {item.name}
                    </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"

                      >
                        <a target='_blank' href="https://www.linkedin.com/in/khurram-mustafa-435b16177/">{item.link}</a>
                      </Typography>
                    <Box mt={2}>
                      <Typography variant="body1" component="p">
                        {item.bio}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default TeamBiosSection;
