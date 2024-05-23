import {SimpleTable, SimpleTableProps} from "./SimpleTable";
import {Card, CardHeader} from "@mui/material";

export interface SimpleTableCardProps extends SimpleTableProps {
  title: string;
}

export function SimpleTableCard(props: SimpleTableCardProps) {
  return (
    <Card>
      <CardHeader title={props.title}/>

      {/*<Divider sx={{borderColor: '#edf6ff', mt: -1, mb: 1}}/>*/}

      <SimpleTable {...props} />
    </Card>
  );
}

