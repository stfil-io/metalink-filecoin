import React, {useState} from "react";
import {Box, Button, Card, CardContent, CardHeader, Dialog, Grid, TextField} from '@material-ui/core/';
import {MetaLinkFilecoinSnapApi} from "@stfil/metalink-filecoin-types";
import toHex from "to-hex";

export interface SignMessageProps {
    api: MetaLinkFilecoinSnapApi | null
}

export const SignMessage = (props: SignMessageProps) => {
    const [textFieldValue, setTextFieldValue] = useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextFieldValue(event.target.value);
      };

    const onSubmit = async () => {
        if(textFieldValue && props.api) {
            const rawMessage = toHex(textFieldValue, {addPrefix: true});
            const sigResponse = await props.api.signMessageRaw(rawMessage);
            if(sigResponse.confirmed && sigResponse.error == null) {
                alert(`This is signature of your message: ${sigResponse.signature}`);
            }
            setTextFieldValue("");
        }
    };

    return (
        <Card style={{height: "100%"}}>
            <CardHeader title="Sign custom message"/>
            <CardContent>
                <Grid container>
                    <TextField
                    onChange={handleChange}
                    value={textFieldValue}
                    size="medium"
                    fullWidth
                    id="custom-message"
                    label="Message"
                    variant="outlined"
                    />
                </Grid>
                <Box m="0.5rem" />
                <Grid container justifyContent="flex-end">
                    <Button onClick={onSubmit} color="secondary" variant="contained" size="large">Sign</Button>
                </Grid>
            </CardContent>
        </Card>
    );
}
