import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { useAppSelector } from "../../../app/hooks";
import TextField from '@mui/material/TextField';

interface TagInputPropType{
    tags: string[], 
    setTags: React.Dispatch<React.SetStateAction<string[]>>
}
const TagInput: React.FC<TagInputPropType> = ({tags, setTags}) => {
  const options = useAppSelector(state => state.tag.tags).map(tag => tag.name)
    return (
      <Autocomplete
        multiple     
        sx={{
          
        }}
        // id="tags-outlined"
        options={options}
        value={tags}
        freeSolo
        onChange={(_event, newValue) => {
          setTags(newValue);
        }}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            color="secondary"   
            placeholder="Select or Type to add tags"
            label="Tags"
          />
          )}
      />
    )
}

export default TagInput;