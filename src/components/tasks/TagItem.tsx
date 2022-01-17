import Chip from '@mui/material/Chip'

interface TagItemProps {
    tag: string
}
const TagItem: React.FC<TagItemProps> = ({tag}) => {
    
    return (
    <Chip label={tag} color='success'/> 
    )
}
export default TagItem;