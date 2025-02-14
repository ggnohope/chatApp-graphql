import { Typography } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";

interface BrandingProps {
  variant: "h5" | "h6";
  display: object;
  href: string;
  sx?: object;
}

const Branding = ({ variant, display, href, sx = {} }: BrandingProps) => {
  return (
    <>
      <ForumIcon sx={{ display, mr: 1 }} />
      <Typography
        variant={variant}
        noWrap
        component="a"
        href={href}
        sx={{
          mr: 2,
          display,
          flexGrow: variant === "h5" ? 1 : 0,
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: "inherit",
          textDecoration: "none",
          ...sx,
        }}
      >
        Chatter
      </Typography>
    </>
  );
};

export default Branding;
