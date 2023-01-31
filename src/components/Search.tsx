import { Button, FormControl, Grid, InputLabel, MenuItem, NativeSelect, Select, SelectChangeEvent, TextField } from '@mui/material';
import React from 'react'; 



const SearchForm = () => {

  const [age, setAge] = React.useState('Characters');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

    return (
        <FormControl id='form' fullWidth>
          <Grid container>
            <Grid item xs={10} id='input_grid_item'>
              <Grid container direction={{xs:'row'}}>
                <Grid item xs>
                  <input id='search_input' type="text" placeholder='Search query'/>
                </Grid>
                <Grid item xs='auto' display='flex' justifyContent='center' alignItems='center'>
                  {/* <InputLabel id="demo-simple-select-filled-label">Age</InputLabel> */}
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={age}
                    onChange={handleChange}
                    sx={{
                      width:'100%',
                      borderRadius:0,
                    }}
                  >
                    <MenuItem value={'Characters'}>Characters</MenuItem>
                    <MenuItem value={'Comics'}>Comics</MenuItem>
                    <MenuItem value={'News'}>News</MenuItem>
                    <MenuItem value={'Movies'}>Movies</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs>
              <button id='search_submit_btn' type='submit'>Search</button>
            </Grid>
          </Grid>
        </FormControl>
    );
}

export default SearchForm;