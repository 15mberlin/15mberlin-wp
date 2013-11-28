<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme and one of the
 * two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * For example, it puts together the home page when no home.php file exists.
 *
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Twenty_Thirteen
 * @since Twenty Thirteen 1.0
 */

get_header(); ?>
<?php get_template_part('head'); ?>

<div id="container">

<div id="post" class="filter">
		<h2>Filtra</h2>
		<div id="pocket"> 
			<ul> 
				<li>Documentos</li>
					<ul class="subcat-list">
						<li class="subcat">Categoria 1</li>
						<li class="subcat">Categoria 2</li>
						<li class="subcat">Categoria 3</li>
						<li class="subcat">Categoria 4</li>
					</ul>
				<li>Asambleas</li>
				<li>Grupos de Trabajo</li>
				<li>Movilización</li>
				<li>Comunicados</li>
			</ul>
			
			<table id="calendario">
				<tr>
					<td class="white"> < </td><td class="white" colspan="5">Marzo</td><td class="white"> > </td>
				</tr>
				<tr>
					<th>L</th><th>m</th><th>x</th><th>j</th><th>v</th><th>s</th><th>d</th>
				</tr>
				<tr>
					<td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td>
				</tr>
				<tr>
					<td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td>
				</tr>
				<tr>
					<td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td>
				</tr>
				<tr>
					<td>21</td><td>22</td><td>23</td><td>24</td><td>25</td><td>26</td><td>27</td>
				</tr>
				<tr>
					<td>27</td><td>28</td><td>29</td><td>30</td><td>31</td><td></td><td></td>
				</tr>
			</table>
		</div>
	</div>

<?php get_template_part("loop-cat"); //loop condicionado ?>

<?php get_footer() ?>