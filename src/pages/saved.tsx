import { useTheme } from "@emotion/react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useContext, useMemo } from "react";
import { tokens } from "../contexts/theme";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../contexts/PageWrapper";
import SavedAnnotationCard from "../components/SavedAnnotationCard";
import { PageContext } from "../contexts/page";
import { isEmpty } from "lodash";
import InfoIcon from "@mui/icons-material/Info";

// var th_left = 504;
// var th_top = 0;
// var th_right = 3528;
// var th_bottom = 3024;

const Saved = () => {
	const theme: any = useTheme();
	const colors2 = useMemo(() => tokens(theme.palette.mode), [theme]);
	const navigate = useNavigate();
	const { annotedData } = useContext(PageContext);
	return (
		<PageWrapper>
			<Box display={"flex"} padding={5}>
				<Grid container spacing={2}>
					{Object.entries(annotedData).map((ann) => (
						<Grid key={`card=${ann[0]}`} item>
							<SavedAnnotationCard
								id={ann[0]}
								label={`Image ${ann[0]}`}
								boxCount={ann[1].length}
							/>
						</Grid>
					))}
				</Grid>

				{isEmpty(annotedData) && (
					<Stack
						direction={"row"}
						justifyContent={"center"}
						marginTop={2}
					>
						<InfoIcon sx={{ mr: 2 }} />
						<Typography variant="body2">
							No saved annotations.
						</Typography>
					</Stack>
				)}
			</Box>
		</PageWrapper>
	);
};

export default Saved;
