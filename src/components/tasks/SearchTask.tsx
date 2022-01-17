import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  updateTitleFilter,
  updateTagFilter,
  updateDueFromFilter,
  updateDueToFilter,
} from "../../reducers/searchSlice";
import Button from "@mui/material/Button";
import { FormControl, InputLabel, OutlinedInput } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FilterAltTwoToneIcon from "@mui/icons-material/FilterAltTwoTone";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

const SearchTasksField: React.FC<{ showSearch: boolean }> = ({
  showSearch,
}) => {
  const options = useAppSelector((state) => state.tag.tags).map(
    (tag) => tag.name
  );
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [searchTag, setSearchTag] = useState<string>("");
  const [searchDueFrom, setSearchDueFrom] = useState<string | null>(null);
  const [searchDueTo, setSearchDueTo] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const handleSearch = () => {
    dispatch(updateTitleFilter(searchTitle));
    dispatch(updateTagFilter(searchTag));
    dispatch(
      updateDueFromFilter(
        searchDueFrom === null
          ? ""
          : new Date(searchDueFrom).toISOString().slice(0, 10)
      )
    );
    dispatch(
      updateDueToFilter(
        searchDueTo === null
          ? ""
          : new Date(searchDueTo).toISOString().slice(0, 10)
      )
    );
  };
  return (
    <Slide direction="right" in={showSearch} mountOnEnter unmountOnExit>
      <Grid
        container
        spacing={2}
        sx={{
          width: "100%",
          margin: "auto",
          borderRadius: 7,
          bgcolor: "#E0E0E0",
          pb: 2,
          pr: 2,
        }}
      >
        <Grid item lg={3} md={3} sm={12} xs={12}>
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel>Title</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              label="Search title"
            />
          </FormControl>
        </Grid>

        <Grid item lg={3} md={3} sm={12} xs={12}>
          <Autocomplete
            disablePortal
            id="combo-box"
            options={options}
            onChange={(_event, newValue) => {
              newValue ? setSearchTag(newValue) : setSearchTag('');
            }}
            renderInput={(params) => <TextField {...params} label="tag" />}
          />
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid item lg={2} md={2} sm={6} xs={6}>
            <DatePicker
              label="From"
              value={searchDueFrom}
              onChange={(newValue) => {
                console.log(newValue);
                setSearchDueFrom(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
          <Grid item lg={2} md={2} sm={6} xs={6}>
            <DatePicker
              label="To"
              value={searchDueTo}
              onChange={(newValue) => {
                console.log(newValue);
                setSearchDueTo(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </Grid>
        </LocalizationProvider>

        <Grid item lg={2} md={2} sm={6} xs={6} sx={{ margin: "auto" }}>
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Slide>
  );
};

export default SearchTasksField;
