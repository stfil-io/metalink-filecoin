import React, {useState} from "react";
import {Box, Button, Card, CardContent, CardHeader, Dialog, Grid, TextField} from '@material-ui/core/';
import {MetaLinkFilecoinSnapApi} from "@stfil/metalink-filecoin-types";
import { verifyMessage } from "@stfil/metalink-filecoin-utils";
import { NetworkPrefix } from "@stfil/metalink-filecoin-utils/build/artifacts/address";

export interface SignMessageProps {
    api: MetaLinkFilecoinSnapApi | null
}

export const SignMessage = (props: SignMessageProps) => {
    const [textFieldValue, setTextFieldValue] = useState<string>("");
    const [textFieldValue2, setTextFieldValue2] = useState<string>("");
    const [textFieldValue3, setTextFieldValue3] = useState<string>("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextFieldValue(event.target.value);
    };

    const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextFieldValue2(event.target.value);
    };

    const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTextFieldValue3(event.target.value);
    };

    const onSubmit = async () => {
        if(textFieldValue && props.api) {
            const sigResponse = await props.api.signMessageRaw(textFieldValue);
            if(sigResponse.confirmed && sigResponse.error == null) {
                console.log('signature: ', sigResponse.signature)
                setTextFieldValue2(textFieldValue)
                setTextFieldValue3(sigResponse.signature as string)
            }
            setTextFieldValue("");
        }
    };

    const onVerify = async () => {
        if(textFieldValue2 && textFieldValue3) {
            const networkPrefix = window.network ? (window.network == 'f' ? NetworkPrefix.Mainnet : NetworkPrefix.Testnet) : NetworkPrefix.Mainnet
            const addr = await verifyMessage(textFieldValue2, textFieldValue3, networkPrefix)
            console.log('addr: ', addr)
            alert(`This is verify of your message: ${addr}`);
            setTextFieldValue2("");
            setTextFieldValue3("");
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

            <CardHeader title="Verify message"/>
            <CardContent>
                <Grid container>
                    <TextField
                    onChange={handleChange2}
                    value={textFieldValue2}
                    size="medium"
                    fullWidth
                    id="message"
                    label="Message"
                    variant="outlined"
                    />
                </Grid>
                <Box m="0.5rem" />
                <Grid container>
                    <TextField
                    onChange={handleChange3}
                    value={textFieldValue3}
                    size="medium"
                    fullWidth
                    id="signature"
                    label="Signature"
                    variant="outlined"
                    />
                </Grid>
                <Box m="0.5rem" />
                <Grid container justifyContent="flex-end">
                    <Button onClick={onVerify} color="secondary" variant="contained" size="large">verify</Button>
                </Grid>
            </CardContent>
        </Card>
    );
}
