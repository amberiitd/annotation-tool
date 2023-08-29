import { Card, Stack, Typography, useTheme } from "@mui/material";
import { FC, useMemo } from "react";
import { tokens } from "../contexts/theme";
import { noop } from "lodash";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import InfoIcon from "@mui/icons-material/Info";
import { Link } from "react-router-dom";

const SavedAnnotationCard: FC<{
	label: string;
	id?: string;
	icon?: string;
	boxCount: number;
}> = ({ label, id, icon, boxCount }) => {
	const theme: any = useTheme();
	const colors = useMemo(() => tokens(theme.palette.mode), [theme]);

	return (
		<Link to={`/draw/${id}`} style={{ textDecoration: "none" }}>
			<Card
				sx={{
					position: "relative",
					height: "12rem",
					width: "14rem",
					padding: 2,
					border: 2,
					borderRadius: 2,
					borderColor: colors.primary[400],
					backgroundColor: "transparent",
					"&:hover": {
						boxShadow: 10,
						borderColor: colors.primary[600],
					},
				}}
			>
				<Typography variant="h1" textAlign={"center"}>
					{icon && (
						<img
							src={`${process.env.PUBLIC_URL}/assets/${icon}`}
							height={30}
						/>
					)}
					{label}
				</Typography>

				<Stack
					direction={"row"}
					justifyContent={"center"}
					marginTop={2}
				>
					{/* <InfoIcon
					sx={{ color: colors.red[100], fontSize: 13, mr: "2px" }}
				/> */}
					<Typography variant="body2" fontSize={10}>
						Boxes: {boxCount || 0}
					</Typography>
				</Stack>
				<TaskAltIcon
					sx={{ position: "absolute", right: 5, bottom: 5 }}
				/>
			</Card>
		</Link>
	);
};

export default SavedAnnotationCard;
