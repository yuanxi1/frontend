import Chip from '@mui/material/Chip'

interface TagItemProps {
    tag: string
}
const TagItem: React.FC<TagItemProps> = ({tag}) => {
    
    return (
    <Chip label={tag} sx={{ m: '1px', bgcolor: '#B39DDB'}}/> 
    )
}
export default TagItem;