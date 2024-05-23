import {Box, Grid, Typography} from "@mui/material";
import handWaveIcon from '../../assets/icons/waving-hand-sign.svg';
import {MainOverviewCard} from "./cards/MainOverview.tsx";
import {StatsCard} from "./cards/Stats.tsx";
import {TopPlatformsCard} from "./cards/TopPlatforms.tsx";
import { WordCloudCard } from "./cards/WordCloud.tsx";


export function SocialMediaDashboardPage() {
  return (
    <Box sx={{p: 5}}>

      <Typography fontFamily="Helvetica Medium" variant="h4">
        Hello

        <img
          alt="wave"
          src={handWaveIcon}
          style={{
            width: 32,
            height: 32,
            marginLeft: 16,
          }}
        />
      </Typography>

      <Typography variant="h6">
        Here is an overview of the social media database.
      </Typography>

      <Grid container spacing={3} sx={{mt: 1}}>
        <Grid item xs={12}>
          <MainOverviewCard hideStats={false}/>
        </Grid>

        <Grid item xs={12} md={6} xl={4}>
          <TopPlatformsCard />
        </Grid>

        <Grid item xs={12} md={6} xl={4}>
          <WordCloudCard />
        </Grid>

        <Grid item xs={12} md={6} xl={4}>
          <StatsCard/>
        </Grid>
      </Grid>
    </Box>
  )
}